// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH
};

export const PATH_PAGE = {
  page404: '/404'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    newReport: path(ROOTS_DASHBOARD, '/new'),
    reportList: path(ROOTS_DASHBOARD, '/list')
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/user/account')
  }
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
