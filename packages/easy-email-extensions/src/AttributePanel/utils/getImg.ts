import { ImageManager } from '@plugilo/easy-email-core';

const defaultImagesMap = {
  IMAGE_59: 'https://plugilo.z6.web.core.windows.net/email_builder/default/image.png',
  AttributePanel_01:
    'https://easy-email-m-ryan.vercel.app/images/e22f78f2-aa76-408d-ba94-c95c7abe1908-image.png',
  AttributePanel_02:
    'https://easy-email-m-ryan.vercel.app/images/3e952a6e-2506-470e-b395-3e0d995157c5.png',
  AttributePanel_03:
    'https://easy-email-m-ryan.vercel.app/images/Fi_vI4vyLhTM-Tp6ivq4dR_ieGHk.png',
};

ImageManager.add(defaultImagesMap);

export function getImg(name: keyof typeof defaultImagesMap) {
  return ImageManager.get(name);
}
