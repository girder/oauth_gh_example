import requests
from girder import events
from girder.models.model_base import AccessException
from girder.plugins.oauth.providers import github

_REQUIRED_ORG = 'girder'  # TODO un-hardcode


def _checkUser(event):
    if event.info['provider'] == github.GitHub:
        token = event.info['token']

        headers = {
            'Authorization': 'token %s' % token['access_token'],
            'Accept': 'application/json'
        }
        resp = requests.get('https://api.github.com/user/orgs', headers=headers)
        orgs = [org['login'] for org in resp.json()]
        if _REQUIRED_ORG not in orgs:
            raise AccessException('This user is not a member of the required GitHub org.')


def load(info):
    events.bind('oauth.auth_callback.before', info['name'], _checkUser)
    github.GitHub.addScopes(['read:org'])
