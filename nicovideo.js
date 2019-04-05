console.debug('My extension for NicoVideo');
{
    // ginza版 動画上の広告を非表示
    let x = document.querySelector('#textMarquee .textMarqueeInner');
    if(x) x.remove();
    // (く)版 動画上の広告を非表示
    let y = document.querySelector('.MarqueeContainer');
    if(y) y.remove();
}

