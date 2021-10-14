function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function rad2deg(rad) {
  return rad * (180 / Math.PI);
}

function round(num, decimals) {
  let power = Math.pow(10, decimals);
  return Math.round(num * power) / power;
}

function randrange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

export {deg2rad, rad2deg, round, randrange};