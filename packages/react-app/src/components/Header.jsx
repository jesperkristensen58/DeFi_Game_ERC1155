import React from "react";
import { Typography, Button, Descriptions, Divider } from "antd";
import { TwitterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// displays a page header

export default function Header({ link, title, subTitle, ...props }) {

  return (<div>
          <div>
          <Typography>
            <Title style={{margin: 40}}>Metana Project ERC1155 Forging</Title>
          </Typography>
          </div>
          <Divider orientation="right" plain>
          {props.children}
          </Divider>
          
      </div>
      );

  {/* return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1.2rem" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "start" }}>
        
        <Title level={4} style={{ margin: "0 0.5rem 0 0", color: "white" }} align="center">
          {title}
        </Title>

        
        <Descriptions size="small" column={1}>
          <Descriptions.Item label=""><Button key="1" shape="round" type="primary" href="https://twitter.com/cryptojesperk" icon={<TwitterOutlined/>} style={{whiteSpace: "normal",height:'auto',marginBottom:'10px'}}>Jesper Kristensen</Button></Descriptions.Item>
        </Descriptions>
        
      </div>
      {props.children}
    </div>
  ); */}
}

Header.defaultProps = {
  title: "Metana Project ERC1155 Forging"
};
