import '/imports/api/users';
import { Meteor } from 'meteor/meteor';
import { Link, LinksCollection } from '/imports/api/links';
import { UsersCollection } from '/imports/api/users/collection';

async function insertLink({ title, url }: Pick<Link, 'title' | 'url'>) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}

Meteor.startup(async () => {
  // Seed the Links collection with sample data if it is empty.
  if ((await LinksCollection.find().countAsync()) === 0) {
    await insertLink({
      title: 'Do the Tutorial',
      url: 'https://react-tutorial.meteor.com/simple-todos/01-creating-app.html',
    });

    await insertLink({
      title: 'Follow the Guide',
      url: 'https://guide.meteor.com',
    });

    await insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com',
    });

    await insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com',
    });
  }

  // Seed the Users collection with sample data for the pub/sub demo.
  if ((await UsersCollection.find().countAsync()) === 0) {
    const seedUsers = [
      { name: 'Alice Johnson', createdAt: new Date('2025-01-15') },
      { name: 'Bob Smith', createdAt: new Date('2025-03-22') },
      { name: 'Carol White', createdAt: new Date('2025-06-10') },
    ];

    for (const user of seedUsers) {
      await UsersCollection.insertAsync(user);
    }
  }

  // Publish the entire Links collection to all clients.
  Meteor.publish('links', function () {
    return LinksCollection.find();
  });

  // NOTE: The Users publications ('users.all' and 'users.byName') are
  // registered inside imports/api/users/publications.ts, which is loaded
  // at the top of this file via `import '/imports/api/users'`.
});
