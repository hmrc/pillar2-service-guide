//= require govuk_tech_docs

const userConsentCookie = document.cookie.match(/userConsent=([^;]+)/)?.[1];

if (userConsentCookie) {
  try {
    const consent = JSON.parse(decodeURIComponent(userConsentCookie));
    if (consent.preferences?.measurement || consent.preferences?.settings) {
      const googleTagScript = document.createElement('script');
      googleTagScript.async = true;
      googleTagScript.src = 'https://www.googletagmanager.com/gtag/js?id=GTM-P39VTVL';
      document.head.appendChild(googleTagScript);

      const trackingConfig = document.createElement('script');
      trackingConfig.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GTM-P39VTVL');
      `;
      document.head.appendChild(trackingConfig);
    }
  } catch (e) {}
}
