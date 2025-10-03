import { Layout, Input, Button, Dropdown, Space } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './LayoutUser.scss';

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '1',
      label: 'Phim đang chiếu',
      onClick: () => {
        console.log('Phim đang chiếu');
      }
    },
    {
      key: '2',
      label: 'Phim sắp chiếu',
      onClick: () => {
        console.log('Phim sắp chiếu');
      }
    }
  ];

  const handleSearch = (value) => {
    console.log('Search:', value);
  };

  return (
    <AntHeader className="Layout-User__header">
      <div className="Layout-User__header-container">
        <div className="Layout-User__header-left">
          <div className="Layout-User__logo" onClick={() => navigate('/')}>
            MOVIX
          </div>
          
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              <Space className="Layout-User__dropdown">
                Phim
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>

          <Input
            className="Layout-User__search"
            placeholder="Tìm kiếm phim..."
            prefix={<SearchOutlined />}
            onPressEnter={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </div>

        <div className="Layout-User__header-right">
          <Button 
            type="default" 
            onClick={() => navigate('/auth/login')}
            className="Layout-User__button Layout-User__button--login"
          >
            Đăng nhập
          </Button>
          <Button 
            type="primary" 
            onClick={() => navigate('/auth/register')}
            className="Layout-User__button Layout-User__button--register"
          >
            Đăng ký
          </Button>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;