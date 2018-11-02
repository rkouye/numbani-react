import Persistence from "../Persistence";

const f_collection = Symbol("Field firestore collection");
const f_db = Symbol("Field firestore db");

const m_extractId = Symbol("Method extract Id");
const m_getRef = Symbol("Method get firestore ref");

const hidden_snapshot = Symbol("Hidden link to snapshot");

export const getSnapshot = (data => data[hidden_snapshot]);

const wrapSnapshot = (snapshot => ({...snapshot.data(), [hidden_snapshot] : snapshot}));

const extractDataFromSnapshot = (snapshot => {
    if(snapshot.docs){
        return snapshot.docs.map(wrapSnapshot);
    } else {
        if(!(snapshot.exists)) return null;
        return wrapSnapshot(snapshot);
    }
});

//FIXME: Use a custom ref and add a ref builder
class FirestorePersistence extends Persistence {
    constructor(db, { mapDocId }={}){
        super();
        this[f_db] = db;
        if(mapDocId && typeof mapDocId !== "function")
            throw new Error("Option mapDocId is expected to be a function value => id");
        this[m_extractId] = mapDocId;
        this[f_collection] = null;
    }

    at(context){
        const clone = new FirestorePersistence(this[f_db], { mapDocId : this[m_extractId] });
        clone[f_collection] = this[f_db].collection(context);
        return clone;
    }

    [m_getRef](value){
        if(this[f_collection] === null)
            throw new Error("Firestore persistence don't allow access to root context. Use at(context) before.");
        if(this[m_extractId]) {
            return this[f_collection].doc(this[m_extractId](value));
        } else {
            return this[f_collection].doc();
        }
    }

    save(value, at){
        const ref = at || this[m_getRef](value);
        return ref.set(value).then(()=>ref);
    }

    read(ref){
        return ref.get().then(extractDataFromSnapshot);
    }
    
    watch(ref, onChange, onError){
        return ref.onSnapshot(
            (snapshot) => onChange(extractDataFromSnapshot(snapshot)),
            onError
        );
    }

    delete(ref){
        //FIXME: Handle collections
        return ref.delete();
    }
}

export default FirestorePersistence;