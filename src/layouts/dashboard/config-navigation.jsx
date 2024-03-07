import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'users',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'reported Items',
    path: '/reported-products',  
    icon: icon('ic_cart'),
  },
  {
    title: 'reported user',
    path: '/reported-user',
    icon: icon('ic_blog'),
  },
  {
    title: 'Total Items',
    path: '/total-items',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
