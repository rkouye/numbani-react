import React from 'react';
import { mount } from 'enzyme';
import expect from 'expect';

import EntityManagerBuilder from '../model/EntityManagerBuilder';
import Persistence from '../model/persistence/provider/InMemory';
import EntitySchemaBuilder from '../model/schema/EntitySchemaBuilder';
import types from '../model/schema/types';
import bootstrap4UiLib from './lib/bootstrap4';
import UI from '.';


const entityManager = new EntityManagerBuilder()
    .withPersistenceProvider(new Persistence({ cars : { mine : {brand : "Toyota"}}}))
    .build();

const carSchema = new EntitySchemaBuilder()
    .addAttribute("brand", types.String.required().min(1).max(255))
    //  .addAttribute("color", types.Enum.required().oneOf("red", "blue","green","black"))
    .build();

const carsRepo = entityManager.register("cars", { schema: carSchema }); // <<<<< Here we have our EntityRepo

export const CarView = UI(bootstrap4UiLib).forRepo(carsRepo); //<<<<< And then we build the EntityView

describe("EntityView.one", ()=>{
    
    it('Allow simple attribute interpolation', ()=>{
        const wrapper = mount(
        <CarView.one value={{ brand : 'Toyota'}}>
            <CarView.fields.brand/>
        </CarView.one>);

        expect(wrapper.text()).toBe('Toyota');
    });

});