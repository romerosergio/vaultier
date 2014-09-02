from django.test.testcases import TransactionTestCase
from django.utils import unittest
from django.utils.unittest.suite import TestSuite
from rest_framework.status import HTTP_403_FORBIDDEN, HTTP_200_OK, HTTP_204_NO_CONTENT
from accounts.models import Member
from accounts.tests.api import register_api_call, auth_api_call, \
    invite_member_api_call
from acls.business.fields import RoleLevelField
from acls.tests.api import create_role_api_call
from libs.version.context import version_context_manager
from vaultier.test.tools import format_response
from vaults.tests.api import create_vault_api_call, delete_vault_api_call, \
    retrieve_vault_api_call
from workspaces.tests.api import create_workspace_api_call, \
    accept_invitation_api_call, delete_workspace_api_call, \
    list_workspaces_api_call


class ApiVaultPermsTest(TransactionTestCase):

    def setUp(self):
        version_context_manager.set_enabled(False)

    def test_000_vault_anonymous_access(self):
        response = create_vault_api_call(None, name="vault_in_workspace", workspace=None)
        self.assertEqual(
            response.status_code,
            HTTP_403_FORBIDDEN,
            format_response(response)
        )


    def test_001_create_delete_vault_as_anonymous(self):

        # create user
        email = 'jan.misek@rclick.cz'
        register_api_call(email=email, nickname='Misan').data
        user1token = auth_api_call(email=email).data.get('token')

        # create workspace
        workspace = create_workspace_api_call(user1token, name='Workspace').data

        #create vault
        vault = create_vault_api_call(user1token, name="vault_in_workspace", workspace=workspace.get('id'))


        #create vault as anonymous
        response = create_vault_api_call(None, name="vault_in_workspace", workspace=workspace.get('id'))
        self.assertEqual(
            response.status_code,
            HTTP_403_FORBIDDEN,
            format_response(response)
        )

        #delete vault as anonymous
        response = delete_vault_api_call(None, vault.get('id'))
        self.assertEqual(
            response.status_code,
            HTTP_403_FORBIDDEN,
            format_response(response)
        )

    def test_010_create_vault_in_workspace_without_acl_to_workspace(self):
        # create user1
        email = 'jan@rclick.cz'
        register_api_call(email=email, nickname='Jan').data
        user1token = auth_api_call(email=email).data.get('token')

        # create user2
        email = 'marcel@rclick.cz'
        register_api_call(email=email, nickname='Marcel').data
        user2token = auth_api_call(email=email).data.get('token')

        # create workspace for user1
        workspace1 = create_workspace_api_call(user1token, name='Workspace').data

        # user2 tries to create vault in workspace of user 2 which he has no access to
        response = create_vault_api_call(user2token, name="vault_in_workspace", workspace=workspace1.get('id'))
        self.assertEqual(
            response.status_code,
            HTTP_403_FORBIDDEN,
            format_response(response)
        )

    def test_020_create_vault_and_and_check_permissions(self):
        # create user1
        email = 'jan@rclick.cz'
        user1 = register_api_call(email=email, nickname='Jan').data
        user1token = auth_api_call(email=email).data.get('token')

        # create user2
        email = 'marcel@rclick.cz'
        user2 = register_api_call(email=email, nickname='Marcel').data
        user2token = auth_api_call(email=email).data.get('token')

        # create workspace for user1
        workspace1 = create_workspace_api_call(user1token, name='Workspace').data

        # create vault
        vault1 = create_vault_api_call(user1token, name="vault_in_workspace", workspace=workspace1.get('id')).data

        #user1 invites user and grant to user role READ to vault1
        user2member = invite_member_api_call(user1token, email=user2.get('email'), workspace=workspace1.get('id')).data
        user2hash = Member.objects.get(pk=user2member.get('id')).invitation_hash
        user2accepted = accept_invitation_api_call(user2token, id=user2member.get('id'), hash=user2hash)
        user2role = create_role_api_call(
            user1token,
            member=user2member.get('id'),
            to_vault=vault1.get('id'),
            level=RoleLevelField.LEVEL_READ
        )

        #user2 tries to read vault, should be allowed
        response = retrieve_vault_api_call(user2token, vault1.get('id'))
        self.assertEqual(
            response.status_code,
            HTTP_200_OK,
            format_response(response)
        )

        #user2 tries to delete vault, should be forbidden
        response = delete_vault_api_call(user2token, vault1.get('id'))
        self.assertEqual(
            response.status_code,
            HTTP_403_FORBIDDEN,
            format_response(response)
        )

        #user2 tries to list workspace of vault1, should be allowed
        response = list_workspaces_api_call(user2token)
        self.assertEqual(
            len(response.data),
            1,
            format_response(response)
        )

        #user2 tries to delete workspace of vault1, should be forbidden
        response = delete_workspace_api_call(user2token, vault1.get('workspace'))
        self.assertEqual(
            response.status_code,
            HTTP_403_FORBIDDEN,
            format_response(response)
        )

        #user1 grants write to workspace, user2 should be able to delete vault
        response = create_role_api_call(
            user1token,
            member=user2member.get('id'),
            to_workspace=workspace1.get('id'),
            level=RoleLevelField.LEVEL_WRITE
        )

        #user2 tries to delete vault, should be allowed
        response = delete_vault_api_call(user2token, vault1.get('id'))
        self.assertEqual(
            response.status_code,
            HTTP_204_NO_CONTENT,
            format_response(response)
        )

    def test_030_retrieve_forbidden(self):
        # create user1
        email = 'jan@rclick.cz'
        register_api_call(email=email, nickname='Jan').data
        user1token = auth_api_call(email=email).data.get('token')

        # create user2
        email = 'marcel@rclick.cz'
        register_api_call(email=email, nickname='Marcel').data
        user2token = auth_api_call(email=email).data.get('token')

        # create workspace for user1
        workspace1 = create_workspace_api_call(user1token, name='workspace').data

        # create vault for user1
        vault1 = create_vault_api_call(user1token, name='vault_in_workspace', workspace=workspace1.get('id')).data

        # user 2 tries to retrieve card1 should be forbidden
        response = retrieve_vault_api_call(user2token, vault1.get('id'))
        self.assertEqual(
            response.status_code,
            HTTP_403_FORBIDDEN,
            format_response(response)
        )

def vault_perms_suite():
    suite = TestSuite()
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(ApiVaultPermsTest))
    return suite