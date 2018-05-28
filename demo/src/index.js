import React, { Component } from 'react';
import {render} from 'react-dom';
import EntityManagerBuilder from '../../src/model/EntityManagerBuilder';
import FirestorePersistence from '../../src/model/persistence/provider/Firestore';

import firebase from 'firebase';
import 'firebase/firestore';
import EntitySchemaBuilder from '../../src/model/schema/EntitySchemaBuilder';
import types from '../../src/model/schema/types';
import UI from '../../src/ui';
import bootstrap4UiLib from '../../src/ui/bootstrap4';

const config = {
    apiKey: "AIzaSyAEimivowRPliJkAdr7RhYvzaunoD2b9W0",
    authDomain: "numbani-framework.firebaseapp.com",
    databaseURL: "https://numbani-framework.firebaseio.com",
    projectId: "numbani-framework",
    storageBucket: "numbani-framework.appspot.com",
    messagingSenderId: "146150168433"
};
firebase.initializeApp(config);
const db = firebase.firestore();
const em = new EntityManagerBuilder()
                .withPersistenceProvider(new FirestorePersistence(db, {mapDocId : value => value.UID}))
                .build();
    const userSchema = new EntitySchemaBuilder()
                .addAttribute("name", types.String.required())
                .addAttribute("organization", types.String)
                .build();

const user = em.buildEntity("user", {schema : userSchema});

const UserView = UI(bootstrap4UiLib).entity(user);
//FIXME: React strict mode
class Demo extends Component {
  render() {
    return (
      <div className="App">
          <UserView.one value={{name : "paul"}} edit>
            <UserView.fields.name/>
            <UserView.fields.organization/>
          </UserView.one>
      </div>
    );
  }
}

render(<Demo/>, document.querySelector('#demo'));