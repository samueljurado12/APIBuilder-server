import { Entity } from 'typeorm';

import Schema from './Schema';

@Entity()
class NonRelationalSchema extends Schema {

}

export default NonRelationalSchema;
