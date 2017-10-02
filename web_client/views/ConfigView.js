import _ from 'underscore';

import PluginConfigBreadcrumbWidget from 'girder/views/widgets/PluginConfigBreadcrumbWidget';
import View from 'girder/views/View';
import events from 'girder/events';
import { restRequest } from 'girder/rest';

import ConfigViewTemplate from '../templates/configView.pug';

var ConfigView = View.extend({
    events: {
        'submit #g-oauth_groups-form': function (event) {
            event.preventDefault();
            this.$('#g-oauth_groups-error-message').empty();

            this._saveSettings([{
                key: 'oauth_groups.required_github_org',
                value: this.$('#g-oauth-groups-required-github-org').val().trim()
            }]);
        }
    },
    initialize: function () {
        restRequest({
            method: 'GET',
            url: 'system/setting',
            data: {
                list: JSON.stringify(['oauth_groups.required_github_org'])
            }
        }).done(_.bind(function (resp) {
            this.render();
            this.$('#g-oauth-groups-required-github-org').val(
                resp['oauth_groups.required_github_org']
            );
        }, this));
    },

    render: function () {
        this.$el.html(ConfigViewTemplate());

        if (!this.breadcrumb) {
            this.breadcrumb = new PluginConfigBreadcrumbWidget({
                pluginName: 'OAuth groups',
                el: this.$('.g-config-breadcrumb-container'),
                parentView: this
            }).render();
        }

        return this;
    },

    _saveSettings: function (settings) {
        restRequest({
            method: 'PUT',
            url: 'system/setting',
            data: {
                list: JSON.stringify(settings)
            },
            error: null
        }).done(_.bind(function () {
            events.trigger('g:alert', {
                icon: 'ok',
                text: 'Settings saved.',
                type: 'success',
                timeout: 4000
            });
        }, this)).fail(_.bind(function (resp) {
            this.$('#g-oauth_groups-error-message').text(
                resp.responseJSON.message
            );
        }, this));
    }
});

export default ConfigView;
