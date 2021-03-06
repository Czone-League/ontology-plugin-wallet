
/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The Ontology Wallet&ID.
 *
 * The The Ontology Wallet&ID is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Ontology Wallet&ID is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The Ontology Wallet&ID.  If not, see <http://www.gnu.org/licenses/>.
 */
import { get } from 'lodash';
import * as React from 'react';
import { RouterProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { NetValue, setSettings } from '../../../redux/settings';
import { reduxConnect, withProps } from '../../compose';
import { GlobalState } from '../../redux';
import { Props, SettingsView } from './settingsView';

const mapStateToProps = (state: GlobalState) => ({
  settings: state.settings
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ setSettings }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => (
    withProps({
      handleCancel: () => {
        props.history.goBack();
      },
      handleSave: async (values: object) => {
        const net: NetValue = get(values, 'net', 'TEST');
        const address: string = get(values, 'address', '');
        const ssl: boolean = get(values, 'ssl', false);

        actions.setSettings(address, ssl, net);

        props.history.goBack();
      }
    }, (injectedProps) => (
      <Component {...injectedProps} settings={reduxProps.settings} />
    ))
  ))
)

export const SettingsPage = enhancer(SettingsView);
