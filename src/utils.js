const formateTime = (time) => { 
  const date = new Date(time)
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

module.exports = {
  formateTime
}