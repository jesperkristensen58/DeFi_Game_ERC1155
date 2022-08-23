import React from "react";
import { Typography, Button, Descriptions, Divider } from "antd";

const { Title, Text } = Typography;

// displays a page header

export default function Header({ link, title, subTitle, ...props }) {

  return (<div>
          <div>
          <Typography>
            <Title style={{margin: 40, color: "white", fontFamily: "futura" }}>Metana Project ERC1155 Forging</Title>
          </Typography>
          </div>
          <Divider orientation="right" style={{color: "white"}} plain>
            {props.children}
          </Divider>
      </div>
      );
}

Header.defaultProps = {
  title: "Metana Project ERC1155 Forging"
};
