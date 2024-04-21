// routes
import { Icon } from '@iconify/react';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: <Icon width={30} height={30} icon="eva:file-text-outline" />,
  analytics: getIcon('ic_analytics'),
  dashboard: <Icon width={30} height={30} icon="eva:list-fill" />,
  booking: getIcon('ic_booking')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Générale',
    items: [
      {
        title: 'Nouveau Rapport',
        path: PATH_DASHBOARD.general.newReport,
        icon: ICONS.dashboard
      }
      // { title: 'Liste des rapports', path: PATH_DASHBOARD.general.reportList, icon: ICONS.ecommerce }
    ]
  }
];

export default sidebarConfig;
