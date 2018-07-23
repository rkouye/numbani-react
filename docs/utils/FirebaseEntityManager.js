import EntityManagerBuilder from 'numbani-react/lib/model/EntityManagerBuilder';
import FirestorePersistence from 'numbani-react/lib/model/persistence/provider/Firestore';

import EntitySchemaBuilder from 'numbani-react/lib/model/schema/EntitySchemaBuilder';
import types from 'numbani-react/lib/model/schema/types';

import firebase from 'numbani-react/docs/utils/numbani-firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

export const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);


const entityManager = new EntityManagerBuilder()
    .withPersistenceProvider(new FirestorePersistence(db))
    .build();



const heroSchema = new EntitySchemaBuilder()
    .addAttribute("alias", types.String.required().min(1).max(255))
    .addAttribute("powers", types.Array.of(types.String).required())
    .build();

export const heroesRepo = entityManager.register("heroes", { schema: heroSchema });