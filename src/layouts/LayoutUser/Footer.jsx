import { Layout, Row, Col, Space } from 'antd';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  YoutubeOutlined 
} from '@ant-design/icons';
import './LayoutUser.scss';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter className="Layout-User__footer">
      <div className="Layout-User__footer-container">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <div className="Layout-User__footer-section">
              <h3 className="Layout-User__footer-title">MOVIX</h3>
              <p className="Layout-User__footer-description">
                Nền tảng xem phim trực tuyến hàng đầu với hàng ngàn bộ phim chất lượng cao.
              </p>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="Layout-User__footer-section">
              <h4 className="Layout-User__footer-heading">Danh mục</h4>
              <ul className="Layout-User__footer-links">
                <li className="Layout-User__footer-link-item">
                  <a href="#" className="Layout-User__footer-link">Phim đang chiếu</a>
                </li>
                <li className="Layout-User__footer-link-item">
                  <a href="#" className="Layout-User__footer-link">Phim sắp chiếu</a>
                </li>
                <li className="Layout-User__footer-link-item">
                  <a href="#" className="Layout-User__footer-link">Phim hot</a>
                </li>
                <li className="Layout-User__footer-link-item">
                  <a href="#" className="Layout-User__footer-link">Rạp chiếu phim</a>
                </li>
              </ul>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="Layout-User__footer-section">
              <h4 className="Layout-User__footer-heading">Hỗ trợ</h4>
              <ul className="Layout-User__footer-links">
                <li className="Layout-User__footer-link-item">
                  <a href="#" className="Layout-User__footer-link">Câu hỏi thường gặp</a>
                </li>
                <li className="Layout-User__footer-link-item">
                  <a href="#" className="Layout-User__footer-link">Liên hệ</a>
                </li>
                <li className="Layout-User__footer-link-item">
                  <a href="#" className="Layout-User__footer-link">Điều khoản sử dụng</a>
                </li>
                <li className="Layout-User__footer-link-item">
                  <a href="#" className="Layout-User__footer-link">Chính sách bảo mật</a>
                </li>
              </ul>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="Layout-User__footer-section">
              <h4 className="Layout-User__footer-heading">Kết nối với chúng tôi</h4>
              <Space size="large" className="Layout-User__social-links">
                <a href="#" className="Layout-User__social-icon">
                  <FacebookOutlined />
                </a>
                <a href="#" className="Layout-User__social-icon">
                  <TwitterOutlined />
                </a>
                <a href="#" className="Layout-User__social-icon">
                  <InstagramOutlined />
                </a>
                <a href="#" className="Layout-User__social-icon">
                  <YoutubeOutlined />
                </a>
              </Space>
            </div>
          </Col>
        </Row>

        <div className="Layout-User__footer-bottom">
          <p className="Layout-User__footer-copyright">
            © 2024 MOVIX. All rights reserved.
          </p>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;