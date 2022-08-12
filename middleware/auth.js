export default async function({ store, route, redirect}) {
  if (route.path !== '/authorization') {
    const authorized = localStorage.actorToken
      && Date.now() - localStorage.actorTokenTime < 60 * 60 * 1000;

    if (authorized) {
      await store.dispatch('loadBuildings');
      await store.dispatch('loadSpecialities');
      await store.dispatch('loadUsers');
    } else {
      redirect({ path: '/authorization' });
    }
  }
}
