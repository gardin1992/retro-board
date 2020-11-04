import React from 'react';
import styled from 'styled-components';

interface SectionProps {
  title: string;
}

const Section: React.FC<SectionProps> = ({ title }) => {
  return <Container></Container>;
};

const Container = styled.section``;

const Title = styled.header``;

const Content = styled.div``;

export default Section;
