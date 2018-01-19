export default function fakeDelay(ms) {
  return new Promise(resolve => {
    if (typeof window === 'undefined'){
      resolve
    }
    setTimeout(resolve, ms);
  });
}