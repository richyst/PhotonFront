import { PhotonFrontPage } from './app.po';

describe('photon-front App', () => {
  let page: PhotonFrontPage;

  beforeEach(() => {
    page = new PhotonFrontPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
