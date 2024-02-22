export default defineNuxtRouteMiddleware((from, to) => {
  const cookie = useCookie("hikenet-token");

  console.log(cookie);
});
