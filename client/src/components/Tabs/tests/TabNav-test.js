/* global jest, describe, it, expect */

import React from 'react';
import TabNav from '../TabNav';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const onToggle = jest.fn();

describe('TabNav', () => {
  it('render', () => {
    const wrapper = shallow(
      <TabNav currentTab="second" onToggle={onToggle}>
        <div name="first" title="Child One" />
        <div name="second" title="Child Two" />
        <div name="three" title="Child Three" />
      </TabNav>
    );

    expect(wrapper.find('Nav')).toHaveLength(1);

    const tabs = wrapper.find('Tab');
    expect(tabs).toHaveLength(3);

    expect(tabs.at(0).prop('active')).toBe(false);
    expect(tabs.at(1).prop('active')).toBe(true);
    expect(tabs.at(2).prop('active')).toBe(false);

    tabs.at(1).prop('onToggle')();
    expect(onToggle).not.toHaveBeenCalled();

    tabs.at(2).prop('onToggle')();
    expect(onToggle).toHaveBeenCalledWith('three');
  });

  it('no child', () => {
    const wrapper = shallow(<TabNav onToggle={onToggle} />);
    expect(wrapper.find('Nav')).toHaveLength(0);
  });
});
