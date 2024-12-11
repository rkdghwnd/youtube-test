const youtubedl = require('youtube-dl-exec');
const axios = require('axios');

async function extractCaptions(videoUrl) {
  try {
    const output = await youtubedl(videoUrl, {
      dumpSingleJson: true,
      noWarnings: true,
      skipDownload: true,
      subLang: 'ko', // 자막 언어 코드 (예: 'en' for English)
      writeSub: true, // 자막 다운로드 활성화
    });

    if (output.automatic_captions.ko) {
      // console.log(output.automatic_captions.ko);

      const captions = output.automatic_captions.ko.map((el) => el.url);
      // console.log(captions);

      const response = await axios.get(captions[0]);

      const result = response.data.events.map((el) => {
        return {
          time: parseInt(el.tStartMs / 1000),
          caption: el.segs?.map((seg) => seg.utf8).join('') || '',
        };
      });

      console.log(
        result
          .map((el) => {
            return `${el.time}초 : ${el.caption}\n`;
          })
          .join(''),
      );
    } else {
      console.log('No captions found for this video.');
    }
  } catch (error) {
    console.error('Error extracting captions:', error);
  }
}

// 유튜브 URL 입력
// const videoUrl = 'https://www.youtube.com/watch?v=DC9FfKSgisg';
const videoUrl = 'https://www.youtube.com/watch?v=Tn6-PIqc4UM';
extractCaptions(videoUrl);
