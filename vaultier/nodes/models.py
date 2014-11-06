from mptt import models as mpttmodels
from django.db import models
from django.conf import settings
from vaultier.business.db import TimestampableMixin


class Node(mpttmodels.MPTTModel, TimestampableMixin):
    """
    Node (document) model
    """
    TYPE_DIRECTORY, TYPE_FILE = xrange(1, 3)

    TYPE = (
        (TYPE_DIRECTORY, 'Directory'),
        (TYPE_FILE, 'File')
    )

    meta = models.TextField()
    type = models.IntegerField(choices=TYPE)
    data = models.FileField(upload_to='', blank=True, null=True)
    color = models.CharField(max_length=7, blank=True, null=True)
    parent = mpttmodels.TreeForeignKey(
        'self', null=True, blank=True, related_name='children')
    enc_version = models.IntegerField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="nodes")
