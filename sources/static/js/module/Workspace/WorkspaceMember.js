/**
 * Workspace memberships, because of nested routing in namespace of vault
 */
Vaultier.VaultMemberIndexRoute = Vaultier.MemberIndexRoute.extend({

    setupInviteData: function(params) {
        var workspace = this.modelFor('Vault');
        return {
            inviteObject: workspace
        }
    },

    setupBlocks: function() {
        return {workspace: true}
    },

    setupBreadcrumbs: function () {
        return Vaultier.Breadcrumbs.create({router: this.get('router')})
            .addHome()
            .addWorkspace()
            .addText('Collaborators');
    },

    setupInviteRoute: function (models) {
        var workspace = this.modelFor('Vault');
        return {
            inviteRouteName: 'Vault.memberInvite'
        }
    }
});


Vaultier.VaultMemberIndexController = Vaultier.MemberIndexController.extend({
});


Vaultier.VaultMemberInviteRoute = Vaultier.MemberInviteRoute.extend({

    setupInviteData: function (params) {
        var workspace = this.modelFor('Vault');
        return {
            inviteObject: workspace,
            inviteParams: { to_workspace: workspace},
            inviteWorkspace: workspace
        }
    },

    setupBreadcrumbs: function () {
        return Vaultier.Breadcrumbs.create({router: this.get('router')})
            .addHome()
            .addWorkspace()
            .addLink('Vault.memberIndex', 'Collaborators')
            .addText('Invite');
    }

});

Vaultier.VaultMemberInviteController = Vaultier.MemberInviteController.extend({
});