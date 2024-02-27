export default defineNuxtRouteMiddleware((to, from) => {
  if (!useAuth().loggedIn) {
    return navigateTo("/auth");
  }
});
