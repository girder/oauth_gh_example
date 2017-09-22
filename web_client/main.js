import events from 'girder/events';
import router from 'girder/router';
import { exposePluginConfig } from 'girder/utilities/PluginUtils';

import ConfigView from './views/ConfigView';

const name = 'oauth_groups'
exposePluginConfig(name, `plugins/${name}/config`);

router.route(`plugins/${name}/config`, `${name}Config`, function () {
    events.trigger('g:navigateTo', ConfigView);
});
