/*
 * Copyright 2022, Polytechnique Montreal and contributors
 *
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/licenses/MIT
 */
import { v4 as uuidV4 } from 'uuid';
import _cloneDeep from 'lodash/cloneDeep';

import { GenericObject, GenericAttributes } from '../GenericObject';
import GenericImmutableCollection from '../GenericImmutableCollection';
import CollectionManager from '../CollectionManager';

class GenericImmutableCollectionImpl extends GenericImmutableCollection<GenericObject<GenericAttributes>> {
    protected getFeatureId(feature: GenericObject<GenericAttributes>): string {
        return feature.attributes.id;
    }
}

const originalAttribs1 = {
    name: 'myName',
    data: {
        some: 'data',
        aNum: 34
    },
    id: uuidV4(),
    internal_id: 'iid1',
    shortname: 'sn1',
    is_frozen: true
};

const originalAttribs2 = {
    name: 'myName2',
    data: {
        some: 'data2',
        aNum: 35
    },
    id: uuidV4(),
    internal_id: 'iid2',
    shortname: 'sn2',
    is_frozen: false
};

const feature1 = new GenericObject(originalAttribs1);
const feature2 = new GenericObject(originalAttribs2);

test('test constructor with no features', function() {

    const immCollection = new GenericImmutableCollectionImpl([]);
    expect(immCollection.size()).toBe(0);
    expect(immCollection.length).toBe(0);
    expect(immCollection.getFeatures().length).toBe(0);
    expect(immCollection.getIds()).toEqual([]);

});

test('test collection attributes', function() {

    const attributes = {
        foo: 'bar',
        bar: ['foo', 'bar'],
        foobar: { 
            foo: 'bar', 
            bar: ['foo', 'bar']
        }
    };
    const immCollection = new GenericImmutableCollectionImpl([], attributes);

    expect(immCollection.attributes).toEqual(attributes);

});

test('test constructor with features', function() {

    const immCollection = new GenericImmutableCollectionImpl([feature1, feature2]);

    expect(immCollection.size()).toBe(2);
    expect(immCollection.length).toBe(2);
    expect(immCollection.getFeatures().length).toBe(2);
    expect(immCollection.getFeatures()[0]?.attributes).toEqual(originalAttribs1);
    expect(immCollection.getFeatures()[1]?.attributes).toEqual(originalAttribs2);
    expect(immCollection.getFeatures()[2]?.attributes).toBeUndefined();
    expect(immCollection.getById(originalAttribs2.id)?.attributes).toEqual(originalAttribs2);
    expect(immCollection.getById(uuidV4())).toBeUndefined();
    expect(immCollection.getIds()).toEqual([originalAttribs1.id, originalAttribs2.id]);
    expect(immCollection.getIndex(uuidV4())).toBeUndefined();
    expect(immCollection.getIndex(originalAttribs1.id)).toBe(0);
    expect(immCollection.getIndex(originalAttribs2.id)).toBe(1);

    // Test the features getter
    expect(immCollection.features.length).toBe(2);
    expect(immCollection.features[0]?.attributes).toEqual(originalAttribs1);
    expect(immCollection.features[1]?.attributes).toEqual(originalAttribs2);
    expect(immCollection.features[2]?.attributes).toBeUndefined();

});
