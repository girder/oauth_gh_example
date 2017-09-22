import requests
from girder import events
from girder.models.model_base import AccessException, ValidationException
from girder.plugins.oauth.providers import github
from girder.utility.model_importer import ModelImporter
from girder.utility.setting_utilities import validator

_REQUIRED_GITHUB_ORG = 'oauth_groups.required_github_org'


@validator(_REQUIRED_GITHUB_ORG)
def _validateRequiredGitHubOrgs(doc):
    pass


def _checkUser(event):
    if event.info['provider'] == github.GitHub:
        requiredGitHubOrg = ModelImporter.model('setting').get(_REQUIRED_GITHUB_ORG)

        if requiredGitHubOrg:
            token = event.info['token']

            headers = {
                'Authorization': 'token %s' % token['access_token'],
                'Accept': 'application/json'
            }
            resp = requests.get('https://api.github.com/user/orgs', headers=headers)
            orgs = [org['login'] for org in resp.json()]
            if requiredGitHubOrg not in orgs:
                raise AccessException('This user is not a member of the required GitHub org.')


def load(info):
    events.bind('oauth.auth_callback.before', info['name'], _checkUser)
    github.GitHub.addScopes(['read:org'])
