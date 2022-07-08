// // import { iTask, Task } from '../models/task.model.js';

// import { iItem, Item } from '../models/item.model.js';
// import { iSuitcase, Suitcase } from '../models/suitcase.model.js';
// import { iUser, User } from '../models/user.model.js';
// import { encrypt } from '../services/authorization.js';
// import { mongooseConnect } from './mongoose.js';

// let aUsers: Array<iUser> = [];
// let aSuitcases: Array<iSuitcase> = [];
// const aItems: Array<iItem> = [
//     {
//         name: '1',
//         weight: 1,
//         destination: 'beach' as any,
//     },
//     {
//         name: '2',
//         weight: 1,
//         destination: 'beach' as any,
//     },
//     {
//         name: '3',
//         weight: 1,
//         destination: 'beach' as any,
//     },
// ];
// aSuitcases = [
//     {
//         destination: 'beach' as any,
//         owner: null,
//         items: [
//             {
//                 item: null,
//                 quantity: 1,
//                 isChecked: false,
//             },
//         ],
//         isWeightOk: true,
//     },
//     {
//         destination: 'beach' as any,
//         owner: null,
//         items: [
//             {
//                 item: null,
//                 quantity: 1,
//                 isChecked: false,
//             },
//         ],
//         isWeightOk: true,
//     },
// ];

// aUsers = [
//     {
//         name: 'a',
//         password: '123456',
//         email: 'a@sample.com',
//         suitcases: [],
//     },
//     {
//         name: 'b',
//         password: '123456',
//         email: 'b@sample.com',
//         suitcases: [],
//     },
// ];

// export const initDB = async () => {
//     const connect = await mongooseConnect();
//     User.collection.drop();
//     Suitcase.collection.drop();
//     Item.collection.drop();

//     aUsers = await Promise.all(
//         aUsers.map(async (item) => ({
//             ...item,
//             password: await encrypt(item.password),
//         }))
//     );
//     const users = await User.insertMany(aUsers);
//     aSuitcases[0].owner = users[0].id;
//     aSuitcases[1].owner = users[1].id;
//     const suitcases = await Suitcase.insertMany(aSuitcases);

//     let finalUsers = [];
//     for (let i = 0; i < users.length; i++) {
//         const item = users[i];
//         finalUsers[i] = await User.findByIdAndUpdate(
//             item.id,
//             {
//                 $set: {
//                     suitcases: suitcases.map((item) => item.id),
//                 },
//             },
//             { new: true }
//         );
//     }
//     aUsers = finalUsers;
//     const items = await Item.insertMany(aItems);
//     const finalSuitcases = [];
//     for (let i = 0; i < suitcases.length; i++) {
//         const item = suitcases[i];
//         finalSuitcases[i] = await Suitcase.findByIdAndUpdate(
//             item.id,
//             {
//                 $set: {
//                     items: item.items.map((item) => ({
//                         ...item,
//                         item: items.find((item2) => item2.name === item.name)
//                             ?.id,
//                     })),
//                 },
//             },
//             { new: true }
//         );
//     }

//     connect.disconnect();
//     return { users, suitcases, items };
// };
