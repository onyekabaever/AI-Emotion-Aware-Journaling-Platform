from rest_framework.routers import DefaultRouter
from .views import JournalEntryViewSet

router = DefaultRouter()
router.register(r"entries", JournalEntryViewSet, basename="entries")

urlpatterns = router.urls
