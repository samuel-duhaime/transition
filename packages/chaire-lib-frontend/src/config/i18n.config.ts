/*
 * Copyright 2022, Polytechnique Montreal and contributors
 *
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/licenses/MIT
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

import config from './project.config';

const detectorOrder = config.detectLanguage ? ['cookie', 'localStorage', 'navigator'] : ['cookie', 'localStorage'];

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .use(HttpApi)
    .init(
        {
            returnNull: false,
            detection: {
                // order and from where user language should be detected
                order: detectorOrder,
                caches: ['localStorage', 'cookie']
            },
            load: 'languageOnly', // no region-specific,
            preload: config.languages,
            nonExplicitSupportedLngs: false,
            fallbackLng: config.defaultLocale || 'en',
            debug: false,
            interpolation: {
                escapeValue: false // not needed for react!!
            },
            react: {
                useSuspense: false
            }
        },
        (err, _t) => {
            if (err) {
                console.log(err);
            }
        }
    );

if (i18n.language) {
    i18n.changeLanguage(i18n.language.split('-')[0]); // force remove region specific
}

// Make sure the currently set language exists, if any
if (i18n.language && config.languages.indexOf(i18n.language) <= -1) {
    i18n.changeLanguage(config.defaultLocale);
}

i18n.on('languageChanged', (language) => {
    document.documentElement.setAttribute('lang', language);
    moment.locale(language);
});
export default i18n;
