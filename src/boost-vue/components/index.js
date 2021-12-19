import XApp from './App';
import XBtn from './Button';
import XDropdownBtn from './Button/DropdownBtn';

import XDialog from './Dialog';
import XGrid from './Grid';
import XGridColumn from './Grid/GridColumn';
import XList from './List';
import XSelect from './Select';
import XSubheader from './Subheader';
import XTreeview from './Treeview';

import XCol from './Layout/Col';
import XColPanel from './Layout/ColPanel';
import XRow from './Layout/Row';

import * as VuetifyComponents from 'vuetify/lib';

var components = { XApp, XBtn, XDropdownBtn, XDialog, XGrid, XGridColumn, XList, XSelect, XSubheader, XTreeview, XCol, XRow, XColPanel };

// _.filter(VuetifyComponents, (value, key) => {
//     _.startsWith(key, 'V');
// });

export default { ...components };
