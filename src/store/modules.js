import bugsnag from '@modules/bugsnag/m-bugsnag';
import device from '@modules/device/m-device';
import liveagent from '@modules/liveagent/m-liveagent';
import loading from '@modules/loading/m-loading';
import modal from '@modules/modal/m-modal';
import notification from '@modules/notification/m-notification';
import otp from '@modules/otp/m-otp';
import secure from '@modules/secure/m-secure';
import service from '@modules/service/m-service';
import session from '@modules/session/m-session';
import user from '@modules/user/m-user';
import contracts from '@modules/contracts/m-contracts';
import profiles from '@modules/profiles/m-profiles';
import ontime from '@modules/ontime/m-ontime';
import sirvase from '@modules/sirvase/m-sirvase';
import projectStore from '@local-store';

export default {
	bugsnag,
	device,
	liveagent,
	loading,
	modal: modal(),
	notification: notification({ name: 'notification', timeout: 4000 }),
	otp,
	secure,
	service,
	session,
	user,
	contracts,
	profiles,
	ontime,
	sirvase,
	...projectStore,
};
