import React from 'react';
import { IBlockData } from '@core/typings';
import { BasicType } from '@core/constants';
import { createBlock } from '@core/utils/createBlock';
import { Wrapper } from '../Wrapper';
import { merge } from 'lodash';

import { generaMjmlMetaData } from '@core/utils/generaMjmlMetaData';
import { BlockRenderer } from '@core/components/BlockRenderer';
import { getAdapterAttributesString, getChildIdx, getPageIdx } from '@core/utils';
import { t } from '@core/utils/I18nManager';

export type IPage = IBlockData<
  {
    'background-color'?: string;
    width: string;
  },
  {
    breakpoint?: string;
    headAttributes: string;
    fonts?: { name: string; href: string }[];
    headStyles?: {
      content?: string;
      inline?: 'inline';
    }[];
    extraHeadContent?: string;
    responsive?: boolean;
    'font-family': string;
    'font-size': string;
    'font-weight': string;
    'line-height': string;
    'text-color': string;
    'user-style'?: {
      content?: string;
      inline?: 'inline';
    };
    'content-background-color'?: string;
  }
>;

export const Page = createBlock<IPage>({
  get name() {
    return t('Page');
  },
  type: BasicType.PAGE,
  create: payload => {
    const defaultData: IPage = {
      type: BasicType.PAGE,
      data: {
        value: {
          breakpoint: '480px',
          headAttributes: '',
          'font-size': '14px',
          'font-weight': '400',
          'line-height': '1.7',
          headStyles: [],
          fonts: [],
          responsive: true,
          'font-family':
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
          'text-color': '#000000',
        },
      },
      attributes: {
        'background-color': '#efeeea',
        width: '676px',
      },
      children: [Wrapper.create()],
    };
    return merge(defaultData, payload);
  },
  validParentType: [],
  render(params) {
    const { data } = params;
    const metaData = generaMjmlMetaData(data);
    const value = data.data.value;

    const breakpoint = value.breakpoint
      ? `<mj-breakpoint width="${data.data.value.breakpoint}" />`
      : '';

    const nonResponsive = !value.responsive
      ? `<mj-raw>
            <meta name="viewport" />
           </mj-raw>
           <mj-style inline="inline">.mjml-body { width: ${
             data.attributes.width || '676px'
           }; margin: 0px auto; }</mj-style>`
      : '';
    const styles =
      value.headStyles
        ?.map(
          style =>
            `<mj-style ${style.inline ? 'inline="inline"' : ''}>${
              style.content
            }</mj-style>`,
        )
        .join('\n') || '';

    const userStyle = value['user-style']
      ? `<mj-style ${value['user-style'].inline ? 'inline="inline"' : ''}>${
          value['user-style'].content
        }</mj-style>`
      : '';

    const defaultStyle = `<mj-style>
      @media only screen and (max-width: ${data.data.value.breakpoint}) {
        .pl-tmpl-section--wrap .pl-tmpl-col {
          width: 100% !important;
        }
      }

      img {
        white-space: pre-line;
      }
      </mj-style>`;

    const defaultScript = `<mj-raw>
    <!-- DCI SCRIPT START --><script type="text/javascript">
          (function () {
            function addToOnLoad(func) {
              var preOnload = window.onload;
              if (typeof window.onload != "function") {
                window.onload = func;
              } else {
                window.onload = function () {
                  if (preOnload) {
                    preOnload();
                  }
                  func();
                };
              }
            }

            addToOnLoad(function () {
              if (ResizeObserver) {
                const resizeObserver = new ResizeObserver((entries) => {
                  const styles = window.getComputedStyle(document.body);
                  const width = Math.ceil(
                    document.body.offsetWidth +
                      parseFloat(styles["marginTop"]) +
                      parseFloat(styles["marginBottom"])
                  );
                  const height = Math.ceil(
                    document.body.offsetHeight +
                      parseFloat(styles["marginLeft"]) +
                      parseFloat(styles["marginRight"])
                  );

                  window.parent.postMessage(
                    {
                      action: "PLUGILO_WEBPAGE_RESIZE",
                      width,
                      height,
                    },
                    "*"
                  );
                });
                resizeObserver.observe(document.body);
              }
            });
          })();
        </script>
      </mj-raw><!-- DCI SCRIPT END -->`;

    const extraHeadContent = value.extraHeadContent
      ? `<mj-raw>${value.extraHeadContent}</mj-raw>`
      : '';

    return (
      <>
        {`
          <mjml>
          <mj-head>
              ${metaData}
              ${nonResponsive}
              ${styles}
              ${userStyle}
              ${defaultStyle}
              ${defaultScript}
              ${breakpoint}
              ${extraHeadContent}
              ${value.fonts
                ?.filter(Boolean)
                .map(item => `<mj-font name="${item.name}" href="${item.href}" />`)}
            <mj-attributes>
              ${value.headAttributes}
              ${
                value['font-family']
                  ? `<mj-all font-family="${value['font-family'].replace(/"/gm, '')}" />`
                  : ''
              }
              ${value['font-size'] ? `<mj-text font-size="${value['font-size']}" />` : ''}
              ${value['text-color'] ? `<mj-text color="${value['text-color']}" />` : ''}
        ${value['line-height'] ? `<mj-text line-height="${value['line-height']}" />` : ''}
        ${value['font-weight'] ? `<mj-text font-weight="${value['font-weight']}" />` : ''}
              ${
                value['content-background-color']
                  ? `<mj-wrapper background-color="${value['content-background-color']}" />
             <mj-section background-color="${value['content-background-color']}" />
            `
                  : ''
              }

            </mj-attributes>
          </mj-head>
          <mj-body ${getAdapterAttributesString(params)}>`}

        {data.children.map((child, index) => (
          <BlockRenderer
            {...params}
            idx={getChildIdx(getPageIdx(), index)}
            key={index}
            data={child}
          />
        ))}

        {'</mj-body></mjml > '}
      </>
    );
  },
});
