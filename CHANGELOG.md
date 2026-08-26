## [1.4.1](https://github.com/bor1e/shone-halacha-prompt/compare/frontend-v1.4.0...frontend-v1.4.1) (2026-08-26)


### Bug Fixes

* **functions:** scope the functions release to commits touching functions/ ([2f876c8](https://github.com/bor1e/shone-halacha-prompt/commit/2f876c8f523df5e93dc6317715c61330e0b77f1d))

# [1.4.0](https://github.com/bor1e/shone-halacha-prompt/compare/frontend-v1.3.0...frontend-v1.4.0) (2026-08-26)


### Features

* **functions:** listHalachot endpoint and batch translation script ([bfedb05](https://github.com/bor1e/shone-halacha-prompt/commit/bfedb05695a6583b5334513b2d89c8858decf6dc))
* **scripts:** add --from flag to batch translation script ([01a49ad](https://github.com/bor1e/shone-halacha-prompt/commit/01a49ade0a5c8f7b42a51366a69ae0f56e1ef175))
* **scripts:** add --limit flag to batch translation script ([28b92b8](https://github.com/bor1e/shone-halacha-prompt/commit/28b92b830e946ad80830f7d283441f79a0d2cb21))
* **translation:** add full-translation level alongside the two summaries ([6e9bafd](https://github.com/bor1e/shone-halacha-prompt/commit/6e9bafd8312eca0609a553323e490fd2d7de5a06))

# [1.3.0](https://github.com/bor1e/shone-halacha-prompt/compare/frontend-v1.2.1...frontend-v1.3.0) (2026-07-23)


### Features

* **functions:** add listTranslations endpoint for cached translation metadata ([f732db8](https://github.com/bor1e/shone-halacha-prompt/commit/f732db8cf5d2a7c8964ec87b6cc1853ab1501808))
* **functions:** allow cached-translation lookup without hebrewText ([1922e73](https://github.com/bor1e/shone-halacha-prompt/commit/1922e73250f1962ac005518e50cb6a44e0f324c8))
* **ui:** add translation list view at /translations ([313105c](https://github.com/bor1e/shone-halacha-prompt/commit/313105c2ff6ab696db6495715e73dbb20186ebb0))
* **ui:** open stored translation from list with regenerate support ([bf6d6d8](https://github.com/bor1e/shone-halacha-prompt/commit/bf6d6d8eef869615162ada500891ec05d80b61b0))

## [1.2.1](https://github.com/bor1e/shone-halacha-prompt/compare/frontend-v1.2.0...frontend-v1.2.1) (2026-07-17)


### Bug Fixes

* **functions:** replace retired gemini-3-pro-preview with gemini-pro-latest alias ([c072f04](https://github.com/bor1e/shone-halacha-prompt/commit/c072f04b285ccbb2f947899effb2e57f72626206))

# [1.2.0](https://github.com/bor1e/shone-halacha-prompt/compare/frontend-v1.1.0...frontend-v1.2.0) (2026-07-17)


### Bug Fixes

* **functions:** set tsc target to es2022 for Node 20 runtime ([52bef4b](https://github.com/bor1e/shone-halacha-prompt/commit/52bef4bf823f0fde8e24b855fb2a587339338240))


### Features

* **functions:** persist originals and translations to shone-halachot Firestore ([33941a9](https://github.com/bor1e/shone-halacha-prompt/commit/33941a9478e25317e50d7d5d7fb8a3f50adfb0d2))
* **functions:** serve cached translation unless forceRegenerate is set ([3250882](https://github.com/bor1e/shone-halacha-prompt/commit/32508829a5df70707151b1e120fd8bba9c09eb76))
* **ui:** load cached translation by default, add regenerate button ([67fc4eb](https://github.com/bor1e/shone-halacha-prompt/commit/67fc4ebee4a03e901d56d3c8fc21811978f41104))

# [1.1.0](https://github.com/bor1e/shone-halacha-prompt/compare/frontend-v1.0.0...frontend-v1.1.0) (2025-11-24)


### Features

* add Polish language support and update localization ([2a39abc](https://github.com/bor1e/shone-halacha-prompt/commit/2a39abcaa04980f53e864f35ed6a02e1f0a61b09))

# 1.0.0 (2025-08-06)


### Bug Fixes

* add missing translations and create pre-push hooks ([3fd160f](https://github.com/bor1e/shone-halacha-prompt/commit/3fd160fd78fcfb7b32f7c99d3c5cf5fe5465c5de))
* correct בס״ד positioning and improve UI visibility ([5792fa7](https://github.com/bor1e/shone-halacha-prompt/commit/5792fa7249396c2c941d9afefe887b64f38e626c))
* improve visibility of UI elements ([87ef198](https://github.com/bor1e/shone-halacha-prompt/commit/87ef1989dd9a36350015e446e97e349a78cf2bc7))
* refine Firebase Hosting configuration for language-specific rewrites ([717466a](https://github.com/bor1e/shone-halacha-prompt/commit/717466a4af3ccdef4c435dcf80f46b16a071f301))
* standardize German locale identifier across the application ([8ee5474](https://github.com/bor1e/shone-halacha-prompt/commit/8ee54744afe2028996226203723f34ebc41a8f6b))
* update extracted halacha number display for improved clarity ([d2afd8e](https://github.com/bor1e/shone-halacha-prompt/commit/d2afd8efe58b989edd6b52cff8a8ba8992cd3fa5))
* update Firebase Hosting configuration for language-specific rewrites ([1694fca](https://github.com/bor1e/shone-halacha-prompt/commit/1694fca07e29a3e901ced9570f46441f24f36bb2))
* update footer component link to correct GitHub repository ([f2d29d2](https://github.com/bor1e/shone-halacha-prompt/commit/f2d29d27673caefc1a37dfe3649e52f1dc1312e4))
* update WhatsAppFormatterService to enhance list formatting and suffix translations ([9036647](https://github.com/bor1e/shone-halacha-prompt/commit/9036647c9d3b7581254e1296bf328d86d4be49df))


### Features

* add Angular Material theme and update dependencies ([3ecd473](https://github.com/bor1e/shone-halacha-prompt/commit/3ecd473a5d175db9e63d8e8717375459d12fedad))
* add auto-versioning system with conventional commits ([404f8f8](https://github.com/bor1e/shone-halacha-prompt/commit/404f8f840d54ab98733c499cc5f18a9bf97df8ab))
* add design library link and update routing ([2765295](https://github.com/bor1e/shone-halacha-prompt/commit/2765295d82d41df086841e93706f16f9049878e3))
* add language-specific rewrites in firebase.json ([77f88b5](https://github.com/bor1e/shone-halacha-prompt/commit/77f88b5e69ed8114261f3bf38364ceeee542f188))
* add locale-based text direction support in prompt form ([b6f8915](https://github.com/bor1e/shone-halacha-prompt/commit/b6f8915ddcb4b46b64a27a1da5803ee4717a2944))
* add shared git hooks and quality assurance documentation ([16bf04e](https://github.com/bor1e/shone-halacha-prompt/commit/16bf04e1fa9e4b1ae9d80e159a2064293c02d7af))
* add summary level toggle for concise and advanced modes ([d556130](https://github.com/bor1e/shone-halacha-prompt/commit/d55613047441b6b73547863fd76addcd76c21d91))
* enhance CI/CD workflow and versioning for functions ([4a439da](https://github.com/bor1e/shone-halacha-prompt/commit/4a439da5a6eabe069b33230ce0e296fe761bb315))
* enhance design library routing and update component template ([0a4ebdc](https://github.com/bor1e/shone-halacha-prompt/commit/0a4ebdcfee04450ad7d984ae3f1a1d2abfbe8b8e))
* enhance Halacha analysis functionality and UI improvements ([5b81869](https://github.com/bor1e/shone-halacha-prompt/commit/5b818696127eafbf861b8b07da9011c7461bc83c))
* enhance Halacha number dialog with RTL support and localization improvements ([773b268](https://github.com/bor1e/shone-halacha-prompt/commit/773b26811163776e44ece1951ef690dda8c45ed2))
* enhance Halacha prompt generation with detailed instructions and improved UI ([0855598](https://github.com/bor1e/shone-halacha-prompt/commit/0855598dbd085057a65b0c11d65ed0d2f71e811b))
* enhance handling of isAdvancedLevel in API requests ([0eeef29](https://github.com/bor1e/shone-halacha-prompt/commit/0eeef297631efe81fef8b43ba2ac1a33dbaed203))
* enhance language support and localization handling ([28cb001](https://github.com/bor1e/shone-halacha-prompt/commit/28cb001a8347b3e2930655e76f89a5f3b2dc2c39))
* enhance multi-language support and add WhatsApp sharing functionality ([942f327](https://github.com/bor1e/shone-halacha-prompt/commit/942f327c53b625b240f89b20e2e51f49332b9653))
* enhance multi-language support and API functionality ([036b161](https://github.com/bor1e/shone-halacha-prompt/commit/036b161add20ac14e4fd7052999d463036331d99))
* enhance multi-language support and routing configuration ([90468d9](https://github.com/bor1e/shone-halacha-prompt/commit/90468d9e1d4206c2b7532f28415c9c3dbd21bfdf))
* enhance prompt form and API integration for Halacha number extraction ([2a68736](https://github.com/bor1e/shone-halacha-prompt/commit/2a687362609f87b352db4e222ea1597112eb0819))
* implement footer component and versioning service ([1668b97](https://github.com/bor1e/shone-halacha-prompt/commit/1668b9757d9468b97e550c8b3fe779c0aef99c79))
* implement multi-language support and enhance localization features ([346c10a](https://github.com/bor1e/shone-halacha-prompt/commit/346c10ab77a3445aa85f04c65c899f44034d5424))
* implement quote replacement in Hebrew text processing ([427e825](https://github.com/bor1e/shone-halacha-prompt/commit/427e8254c35830350a5b3c541045f2a0a995a498))
* init ([ac7fce8](https://github.com/bor1e/shone-halacha-prompt/commit/ac7fce8cf1854be5954d12316eac32d7bce37a5b))
* init workflow ([33b173e](https://github.com/bor1e/shone-halacha-prompt/commit/33b173e2adcd945bd6b464dc6badd6dadd9cb18c))
* integrate analysis language selection into prompt form ([e43e08c](https://github.com/bor1e/shone-halacha-prompt/commit/e43e08c2169a5954479e27e64c165e0b9e31d743))
* update CI/CD workflow and versioning strategy ([0e48b98](https://github.com/bor1e/shone-halacha-prompt/commit/0e48b9895ce2521a5b52cd4850fa64fb1cd42108))
* update project styling and documentation for improved user experience ([238ea18](https://github.com/bor1e/shone-halacha-prompt/commit/238ea1897f7a6b9df4ed0962519010f55a94ef8b))

# [1.2.0](https://github.com/bor1e/shone-halacha-prompt/compare/v1.1.0...v1.2.0) (2025-08-06)


### Features

* add summary level toggle for concise and advanced modes ([d556130](https://github.com/bor1e/shone-halacha-prompt/commit/d55613047441b6b73547863fd76addcd76c21d91))
* enhance CI/CD workflow and versioning for functions ([4a439da](https://github.com/bor1e/shone-halacha-prompt/commit/4a439da5a6eabe069b33230ce0e296fe761bb315))
* enhance handling of isAdvancedLevel in API requests ([0eeef29](https://github.com/bor1e/shone-halacha-prompt/commit/0eeef297631efe81fef8b43ba2ac1a33dbaed203))

# [1.1.0](https://github.com/bor1e/shone-halacha-prompt/compare/v1.0.1...v1.1.0) (2025-08-06)


### Features

* add design library link and update routing ([2765295](https://github.com/bor1e/shone-halacha-prompt/commit/2765295d82d41df086841e93706f16f9049878e3))
* enhance design library routing and update component template ([0a4ebdc](https://github.com/bor1e/shone-halacha-prompt/commit/0a4ebdcfee04450ad7d984ae3f1a1d2abfbe8b8e))

## [1.0.1](https://github.com/bor1e/shone-halacha-prompt/compare/v1.0.0...v1.0.1) (2025-08-06)


### Bug Fixes

* update WhatsAppFormatterService to enhance list formatting and suffix translations ([9036647](https://github.com/bor1e/shone-halacha-prompt/commit/9036647c9d3b7581254e1296bf328d86d4be49df))

# 1.0.0 (2025-08-06)


### Bug Fixes

* add missing translations and create pre-push hooks ([3fd160f](https://github.com/bor1e/shone-halacha-prompt/commit/3fd160fd78fcfb7b32f7c99d3c5cf5fe5465c5de))
* correct בס״ד positioning and improve UI visibility ([5792fa7](https://github.com/bor1e/shone-halacha-prompt/commit/5792fa7249396c2c941d9afefe887b64f38e626c))
* improve visibility of UI elements ([87ef198](https://github.com/bor1e/shone-halacha-prompt/commit/87ef1989dd9a36350015e446e97e349a78cf2bc7))
* refine Firebase Hosting configuration for language-specific rewrites ([717466a](https://github.com/bor1e/shone-halacha-prompt/commit/717466a4af3ccdef4c435dcf80f46b16a071f301))
* standardize German locale identifier across the application ([8ee5474](https://github.com/bor1e/shone-halacha-prompt/commit/8ee54744afe2028996226203723f34ebc41a8f6b))
* update extracted halacha number display for improved clarity ([d2afd8e](https://github.com/bor1e/shone-halacha-prompt/commit/d2afd8efe58b989edd6b52cff8a8ba8992cd3fa5))
* update Firebase Hosting configuration for language-specific rewrites ([1694fca](https://github.com/bor1e/shone-halacha-prompt/commit/1694fca07e29a3e901ced9570f46441f24f36bb2))
* update footer component link to correct GitHub repository ([f2d29d2](https://github.com/bor1e/shone-halacha-prompt/commit/f2d29d27673caefc1a37dfe3649e52f1dc1312e4))


### Features

* add Angular Material theme and update dependencies ([3ecd473](https://github.com/bor1e/shone-halacha-prompt/commit/3ecd473a5d175db9e63d8e8717375459d12fedad))
* add auto-versioning system with conventional commits ([404f8f8](https://github.com/bor1e/shone-halacha-prompt/commit/404f8f840d54ab98733c499cc5f18a9bf97df8ab))
* add language-specific rewrites in firebase.json ([77f88b5](https://github.com/bor1e/shone-halacha-prompt/commit/77f88b5e69ed8114261f3bf38364ceeee542f188))
* add locale-based text direction support in prompt form ([b6f8915](https://github.com/bor1e/shone-halacha-prompt/commit/b6f8915ddcb4b46b64a27a1da5803ee4717a2944))
* add shared git hooks and quality assurance documentation ([16bf04e](https://github.com/bor1e/shone-halacha-prompt/commit/16bf04e1fa9e4b1ae9d80e159a2064293c02d7af))
* enhance Halacha analysis functionality and UI improvements ([5b81869](https://github.com/bor1e/shone-halacha-prompt/commit/5b818696127eafbf861b8b07da9011c7461bc83c))
* enhance Halacha number dialog with RTL support and localization improvements ([773b268](https://github.com/bor1e/shone-halacha-prompt/commit/773b26811163776e44ece1951ef690dda8c45ed2))
* enhance Halacha prompt generation with detailed instructions and improved UI ([0855598](https://github.com/bor1e/shone-halacha-prompt/commit/0855598dbd085057a65b0c11d65ed0d2f71e811b))
* enhance language support and localization handling ([28cb001](https://github.com/bor1e/shone-halacha-prompt/commit/28cb001a8347b3e2930655e76f89a5f3b2dc2c39))
* enhance multi-language support and add WhatsApp sharing functionality ([942f327](https://github.com/bor1e/shone-halacha-prompt/commit/942f327c53b625b240f89b20e2e51f49332b9653))
* enhance multi-language support and API functionality ([036b161](https://github.com/bor1e/shone-halacha-prompt/commit/036b161add20ac14e4fd7052999d463036331d99))
* enhance multi-language support and routing configuration ([90468d9](https://github.com/bor1e/shone-halacha-prompt/commit/90468d9e1d4206c2b7532f28415c9c3dbd21bfdf))
* enhance prompt form and API integration for Halacha number extraction ([2a68736](https://github.com/bor1e/shone-halacha-prompt/commit/2a687362609f87b352db4e222ea1597112eb0819))
* implement footer component and versioning service ([1668b97](https://github.com/bor1e/shone-halacha-prompt/commit/1668b9757d9468b97e550c8b3fe779c0aef99c79))
* implement multi-language support and enhance localization features ([346c10a](https://github.com/bor1e/shone-halacha-prompt/commit/346c10ab77a3445aa85f04c65c899f44034d5424))
* implement quote replacement in Hebrew text processing ([427e825](https://github.com/bor1e/shone-halacha-prompt/commit/427e8254c35830350a5b3c541045f2a0a995a498))
* init ([ac7fce8](https://github.com/bor1e/shone-halacha-prompt/commit/ac7fce8cf1854be5954d12316eac32d7bce37a5b))
* init workflow ([33b173e](https://github.com/bor1e/shone-halacha-prompt/commit/33b173e2adcd945bd6b464dc6badd6dadd9cb18c))
* integrate analysis language selection into prompt form ([e43e08c](https://github.com/bor1e/shone-halacha-prompt/commit/e43e08c2169a5954479e27e64c165e0b9e31d743))
* update project styling and documentation for improved user experience ([238ea18](https://github.com/bor1e/shone-halacha-prompt/commit/238ea1897f7a6b9df4ed0962519010f55a94ef8b))
