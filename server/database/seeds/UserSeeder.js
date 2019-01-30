'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class UserSeeder {
  async run() {
    const userArray = [
      { name: 'Mike Bruschwein', username: 'Mike_Bruschwein_16', email: 'm.bruschwein16@gmail.com', password: 'password', species: 'Bernese Mountain Dog', sex: 'Male', city: 'Billings', state: 'MT', age: '5', bio: 'Loves long walks on the beach and beef jerkey', url: 'https://s3.us-west-2.amazonaws.com/pinderbucket/Bernese-Mountain-Dog_1.jpg'},
      { name: 'Robert Crum', username: 'gargansa', email: 'gargansa@hotmail.com', password: 'password', species: 'corgi', sex: 'Male', city: 'Avon', state: 'MT', age: '7', bio: 'Did you know corgis butts look like a loaf of bread?', url: 'https://i.barkpost.com/wp-content/uploads/2015/01/corgi2.jpg?q=70&fit=crop&crop=entropy&w=808&h=500' },
      { name: 'Angela Montanye', username: 'AngieAnge', email: 'amontanye@aol.com', password: 'password', species: 'Shar pei', sex: 'Female', city: 'Helena', state: 'MT', age: '4', bio: 'Loves waking up early to watch Disney cartoons', url: 'https://puppytoob.com/wp-content/uploads/2017/11/Shar-Pei-8.jpg' },
      { name: 'Cory Cotterell', username: 'CorrDawg', email: 'corrdawg13@askjeeves.com', password: 'password', species: 'Black Lab', sex: 'Male', city: 'Bozeman', state: 'MT', age: '0', bio: 'Loves staying up late hanging out with the females', url: 'https://ybxzcgnc7b-flywheel.netdna-ssl.com/wp-content/uploads/2017/04/faithful-black-lab.jpg' },
      { name: 'Doggo MaGee', username: 'doggo', email: 'dog@diggitydog.com', password: 'password', species: 'Golden Retriever', sex: 'Female', city: 'Bozeman', state: 'MT', age: '5', bio: 'Shut up and throw the frisbee already', url: 'https://s3.us-west-2.amazonaws.com/pinderbucket/golden-retriever-dogs.jpg' },
      { name: 'Chinchita', username: 'Chichi', email: 'chinchita@churro.com', password: 'password', species: 'Chihuahua', sex: 'Female', city: 'Bozeman', state: 'MT', age: '3', bio: 'Yo quiero Taco Bell', url: 'https://s3.us-west-2.amazonaws.com/pinderbucket/chihuahua.jpg' },
      { name: 'Daisy', username: 'Daisy27', email: 'daisy@daisy.com', password: 'password', species: 'Golden Retriever', sex: 'Female', city: 'Bozeman', state: 'MT', age: '5', bio: 'Just trying to live my best doggy life. Not looking for anything serious just looking to mess around. You can catch me in the park playing with sticks', url: "https://www.omlet.us/images/cache/530/768/Dog-Golden_Retriever-A_Golden_Retriever_sitting_patiently,_showing_off_it's_beautiful,_soft_coat.jpg" },
      { name: 'CoCo', username: 'crazy_coco', email: 'coco@coco.com', password: 'password', species: 'Golden Retriever', sex: 'Female', city: 'Bozeman', state: 'MT', age: '5', bio: 'Not here for a long time but for a good time. I like strolling in the doggy parks and sniffy butts', url: 'https://d17fnq9dkz9hgj.cloudfront.net/breed-uploads/2018/08/golden-retriever-card-small.jpg?bust=1535568541' },
      { name: 'Sasha', username: 'SexySasha', email: 'sasha@sasha.com', password: 'password', species: 'Golden Retriever', sex: 'Female', city: 'Bozeman', state: 'MT', age: '5', bio: 'Roses are red, bacon is red. Poems are hard. Bacon.', url: 'https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/05161950/Golden-Retriever-Slide-11.jpg' },
      { name: 'Max', username: 'MaxyMax', email: 'max@max.com', password: 'password', species: 'Golden Retriever', sex: 'Male', city: 'Bozeman', state: 'MT', age: '5', bio: 'Looking for a partner who will go to park and sniff butts with me.', url: 'https://cdn3-www.dogtime.com/assets/uploads/gallery/golden-retriever-dogs-and-puppies/golden-retriever-dogs-puppies-6.jpg' },
      { name: 'Teddy', username: 'TipsyTeddy', email: 'teddy@teddy.com', password: 'password', species: 'Grizzly Bear', sex: 'Male', city: 'Bozeman', state: 'MT', age: '5', bio: "My name may be teddy but I ain't no teddy bear.", url: 'https://www.nps.gov/articles/images/Image-w-cred-cap_-1200w-_-Brown-Bear-page_-brown-bear-in-fog_2_1.jpg?maxwidth=1200&maxheight=1200&autorotate=false' },
      { name: 'Jake', username: 'JerkyJake', email: 'jake@jake.com', password: 'password', species: 'Kangaroo', sex: 'Male', city: 'Bozeman', state: 'MT', age: '5', bio: "Yo what's up my names Jake I go to the gym 8 days a week but I'll still make time for you. My muscles are big and so is my personality ;)", url: 'https://media.npr.org/assets/img/2018/12/10/roger-the-kangaroo-sanctuary-alice-springs-2_custom-e0dfceba6d2665cc8cc0daa5a57eae2bcda46ad8-s800-c85.jpg' },
      { name: 'Finn', username: 'FlakeyFinn', email: 'finn@finn.com', password: 'password', species: 'Golden Retriever', sex: 'Male', city: 'Bozeman', state: 'MT', age: '5', bio: "The ladies call me flakey finn because I'm so hard to get. If you can score a date with me then you must mean something to me.", url: 'https://www.dogster.com/wp-content/uploads/2017/08/Golden-retriever-in-the-fall.jpg' },
      { name: 'Hunter', username: 'HansomeHunter', email: 'hunter@hunter.com', password: 'password', species: 'Koala', sex: 'Male', city: 'Bozeman', state: 'MT', age: '5', bio: "I'm the best hunter there is. I enjoy spending lots of time in the woods and sutffing my face with food.", url: 'https://s3.us-west-2.amazonaws.com/pinderbucket/koala.jpg' }
    ]
    for (var i = 0; i < userArray.length; i++) {
      await Factory.model('App/Models/User').create({ name: userArray[i].name, username: userArray[i].username, email: userArray[i].email, password: userArray[i].password, species: userArray[i].species, sex: userArray[i].sex, city: userArray[i].city, state: userArray[i].state, age: userArray[i].age, bio: userArray[i].bio, url: userArray[i].url })
    }
  }
}

module.exports = UserSeeder
