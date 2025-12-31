// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as device from './device';
import * as graphene from './graphene';
import * as account from './account';
import * as qrCode from './qrCode';
import * as bitcoin from './bitcoin';
import * as ethereum from './ethereum';
import * as evmChains from './evmChains';
import * as solana from './solana';
import * as cosmos from './cosmos';
import * as xrp from './xrp';
import * as cardano from './cardano';
import * as polkadot from './polkadot';
import * as multiChain from './multiChain';
import * as transaction from './transaction';
import * as psbt from './psbt';
import * as signing from './signing';
import * as multisig from './multisig';
import * as watchOnly from './watchOnly';
import * as liquid from './liquid';
import * as biometric from './biometric';
import * as pin from './pin';
import * as backup from './backup';
import * as security from './security';
import * as firmware from './firmware';
import * as utility from './utility';

export {
	device,
	graphene,
	account,
	qrCode,
	bitcoin,
	ethereum,
	evmChains,
	solana,
	cosmos,
	xrp,
	cardano,
	polkadot,
	multiChain,
	transaction,
	psbt,
	signing,
	multisig,
	watchOnly,
	liquid,
	biometric,
	pin,
	backup,
	security,
	firmware,
	utility,
};

/**
 * Action registry mapping resource names to their execute functions
 */
export const actionRegistry = {
	device,
	graphene,
	account,
	qrCode,
	bitcoin,
	ethereum,
	evmChains,
	solana,
	cosmos,
	xrp,
	cardano,
	polkadot,
	multiChain,
	transaction,
	psbt,
	signing,
	multisig,
	watchOnly,
	liquid,
	biometric,
	pin,
	backup,
	security,
	firmware,
	utility,
} as const;

export type ActionResource = keyof typeof actionRegistry;
