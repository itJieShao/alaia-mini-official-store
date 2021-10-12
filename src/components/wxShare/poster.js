/* eslint-disable */
import { get } from '../../utils/utilityOperationHelper'

const canvasHeight = 1210;
const canvasWidth = 750;

function _letterSpacing(text, startX, startY, Spacing = 0, style) {
  const textList = text.split('');
  return textList.map((item) => {
    const itemSettings = {
      type: 'text',
      text: item,
      css: {
        ...style,
        bottom: `${startY}px`,
        left: `${startX}px`,
      },
    }
    startX += Spacing;
    startY >= canvasWidth && (startY += Spacing)
    return itemSettings;
  });
}

export default function handlePainterJson(params) {
  return {
    width: `${canvasWidth}px`,
    height: `${canvasHeight}px`,
    background: '#000',
    views: [
      {
        type: 'rect',
        css: {
          color: '#ffffff',
          background: '#ffffff',
          width: `${canvasWidth}px`,
          height: '225px',
          bottom: '0px',
          left: '0px',
        },
      },
      {
        type: 'image',
        url: get(params, 'images[0].url') || get(params, 'images[1].url'),
        css: {
          top: 0,
          lett: 0,
          width: `${canvasWidth}px`,
          height: `${canvasHeight - 225}px`,
        },
      },
      {
        type: 'image',
        url: 'https://uxresources.baozun.com/prod/99001388/20210310/7D6589E422E7988AA1C099E1F3F845CE.png',
        css: {
          width: '135px',
          height: '40px',
          top: '47rpx',
          right: '43rpx',
        },
      },
      {
        type: 'text',
        text: params.productAttribute,
        css: {
          fontSize: '40px',
          color: '#fff',
          bottom: '485px',
          left: '0',
          width: `${canvasWidth}px`,
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        text: params.subTitle,
        css: {
          fontSize: '40px',
          color: '#aeafb3',
          bottom: '440px',
          left: '0',
          maxLines: '1',
          width: `${canvasWidth}px`,
          textAlign: 'center',
        },
      },
      {
        type: 'rect',
        css: {
          color: '#f0f0f0',
          background: '#f0f0f0',
          width: '76px',
          height: '1px',
          bottom: '410px',
          left: `${canvasWidth / 2 - 76 / 2}px`,
        },
      },
      {
        type: 'text',
        text: 'tasaki',
        css: {
          fontSize: '40px',
          color: '#fff',
          bottom: '355px',
          left: '0',
          width: `${canvasWidth}px`,
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        text: params.title,
        css: {
          fontSize: '40px',
          color: '#fff',
          bottom: '300px',
          left: '0',
          width: `${canvasWidth}px`,
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        text: '长按识别二维码',
        css: {
          fontSize: '22px',
          color: '#000',
          fontWeight: 700,
          left: `${parseInt(canvasWidth / 5)}px`,
          bottom: `${130}px`,
        },
      },
      {
        type: 'text',
        text: '即刻奢享',
        css: {
          fontSize: '22px',
          fontWeight: 700,
          color: '#000',
          left: `${parseInt(canvasWidth / 5 + 25)}px`,
          bottom: `${90}px`,
        },
      },
      // ..._letterSpacing('长按识别二维码', parseInt(canvasWidth / 6), 100, 32, {
      //   fontSize: '20px',
      //   color: '#000',
      // }),
      // ..._letterSpacing('即可奢享', parseInt(canvasWidth / 6 + 45), 65, 32, {
      //   fontSize: '20px',
      //   color: '#000',
      // }),
      {
        type: 'image',
        url: params.qrcodeImg,
        css: {
          width: '168px',
          height: '168px',
          right: '100px',
          bottom: '29px',
        },
      },
    ],
  };
}
