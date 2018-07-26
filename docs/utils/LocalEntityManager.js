import EntityManagerBuilder from 'numbani-react/lib/model/EntityManagerBuilder';
import InMemory from 'numbani-react/lib/model/persistence/provider/InMemory';

import EntitySchemaBuilder from 'numbani-react/lib/model/schema/EntitySchemaBuilder';
import types from 'numbani-react/lib/model/schema/types';

import 'bootstrap/dist/css/bootstrap.min.css';

const entityManager = new EntityManagerBuilder()
    .withPersistenceProvider(new InMemory())
    .build();

const heroSchema = new EntitySchemaBuilder()
    .addAttribute("alias", types.String.required().min(1).max(255))
    .addAttribute("age", types.Number.min(18))
    .addAttribute("powers", types.Array.of(types.String.min(1)).max(3))
    .build();

export const localHeroesRepo = entityManager.register("heroes", { schema: heroSchema });

export const defaultHero = {"alias": "React man",
  "age" : 0,
  "colors": [],
  "name": "YouAre waitForIt Awesome",
  "powers": ["React prodigy", "JS proficiency"]
};