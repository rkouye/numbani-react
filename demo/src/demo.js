import React, { Component } from 'react';
import { render } from 'react-dom';

import EntityManagerBuilder from '../../src/model/EntityManagerBuilder';
import FirestorePersistence from '../../src/model/persistence/provider/Firestore';
import EntitySchemaBuilder from '../../src/model/schema/EntitySchemaBuilder';
import types from '../../src/model/schema/types';
import UI from '../../src/ui';
import bootstrap4UiLib from '../../src/ui/lib/bootstrap4';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthServiceProvider, AuthServiceConsumer } from '../../src/ui/auth/AuthService';
import Login from '../../src/ui/firebaseui/Login';

import FirebaseAuth from '../../src/auth/provider/FirebaseAuth';

import firebase from './numbani-firebase';
import firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);
const em = new EntityManagerBuilder()
  .withPersistenceProvider(new FirestorePersistence(db, { mapDocId: value => value.UID }))
  .build();
const userSchema = new EntitySchemaBuilder()
  .addAttribute("email", types.String.required())
  .addAttribute("displayName", types.String.required().min(5))
  .build();
const user = em.buildEntity("users", { schema: userSchema });
const UserView = UI(bootstrap4UiLib).entity(user);

//FIXME: React strict mode
class Demo extends Component {
  render() {
    return (
      <div className="App">
        <AuthServiceProvider authService={new FirebaseAuth(firebase.auth())}>
          <p>Demo Login (With firebase Auth Provider)</p>
          <AuthServiceConsumer>
            {
              authService =>
                authService.userIsConnected() ?
                  <React.Fragment>
                    Display user info with an EntityView.one in an EntityView.read
                  <UserView.read entityRef={db.collection("users").doc("test")}>
                    {
                      user => <div>
                        <UserView.one value={user}>
                          Email : <UserView.fields.email />
                          <br />
                          Nom : <UserView.fields.displayName />
                          <br />
                        </UserView.one>
                        <br />
                        
                      </div>
                    }
                  </UserView.read>
                    <p>Allow editing  some user info in an EntityView.connect</p>
                    <UserView.connect entityRef={db.collection("users").doc("test")} edit>
                      Nom : <UserView.fields.displayName />
                      <br/>
                      <UserView.button.save>Save</UserView.button.save>
                    </UserView.connect>
                    <br />
                    -------------------------
                    <br />
                    <button onClick={authService.signOut}>Sign Out</button>
                  </React.Fragment>
                  
                  :
                  <Login
                    firebaseAuth={firebase.auth()}
                    firebaseui={firebaseui}
                    uiConfig={{
                      signInOptions: [
                        firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                      ]
                    }} />
            }
          </AuthServiceConsumer>
        </AuthServiceProvider>
      </div>
    );
  }
}

render(<Demo />, document.querySelector('#demo'));