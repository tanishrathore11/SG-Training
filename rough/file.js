function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        reject(new Error('Invalid id'));
      } else {
        resolve({ id, name: 'Grace Hopper' });
      }
    }, 200);
  });
}

fetchUser(-1)
  .then(user => {
    console.log('Got user:', JSON.stringify(user));
    return user.name;
  })
  .then(name => console.log('Name only:', name))
  .catch(err => console.error('Error:', err.message))
  .finally(() => console.log('Done, regardless of outcome'));

// Try changing fetchUser(1) to fetchUser(-1) to trigger the catch block.
console.log('This logs immediately - fetchUser does not block the main thread');