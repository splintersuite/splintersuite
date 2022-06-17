import React from 'react';
import styled from '@emotion/styled';
import { Button, Table } from '@mantine/core';
import moment from 'moment';

import Label from '../../components/Label.jsx';
import Text from '../../components/Text.jsx';
import Card from '../../components/Card.jsx';
import Col from '../../components/Col.jsx';
import Row from '../../components/Row.jsx';
import DashboardPage from '../../components/DashboardPage.jsx';
import { useUser } from '../../contexts/UserContext.jsx';

import billing1 from '../../assets/images/billing-1.png';
import billing2 from '../../assets/images/billing-2.png';
import billing3 from '../../assets/images/billing-3.png';

const StyledTable = styled(Table)`
    margin-top: ${({ theme }) => theme.space(3)};
`;

const TableHeader = styled.th`
    opacity: 0.8;
    color: ${({ theme }) => theme.colors.white} !important;
    border-bottom: ${({ theme }) =>
        `2px solid ${theme.colors.grey[800]}`} !important;
`;

const TableRow = styled.tr`
    border-bottom: ${({ theme }) =>
        `1px solid ${theme.colors.grey[800]}`} !important;
    &:last-child {
        border-bottom: none !important;
    }
    &:hover {
        background: ${({ theme }) => theme.colors.grey[800]};
    }
`;

const TableItem = styled.td`
    font-size: 16px !important;
    color: ${({ theme }) => theme.colors.white} !important;
    border: none !important;
`;

const Paid = styled.span`
    color: ${({ theme }) => theme.colors.success} !important;
`;

const StepLabel = styled(Label)`
    margin-top: ${({ theme }) => theme.space(3)};
`;

const StepImage = styled.img`
    width: 512px;
    border-radius: 8px;
`;

const StepCol = styled(Col)`
    margin-top: ${({ theme }) => theme.space(4)};
    margin-bottom: ${({ theme }) => theme.space(2)};
`;

const Billing = () => {
    const { invoices, handleConfirmInvoice } = useUser();

    return (
        <DashboardPage>
            <Card>
                <Row>
                    <h1>Billing</h1>
                </Row>
            </Card>

            <Card>
                <h2>Invoices</h2>
                <StyledTable>
                    <thead>
                        <tr>
                            <TableHeader>Name</TableHeader>
                            <TableHeader>Due</TableHeader>
                            <TableHeader>Amount</TableHeader>
                            <TableHeader>Status</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice, idx) => (
                            <TableRow key={idx}>
                                <TableItem>{invoice.season_name}</TableItem>
                                <TableItem>
                                    {moment(invoice.due_at).format(
                                        'MMMM Do YYYY'
                                    )}
                                </TableItem>
                                <TableItem>{invoice.amount_due} DEC</TableItem>
                                <TableItem>
                                    {invoice.paid_at ? (
                                        <Paid>Paid</Paid>
                                    ) : (
                                        <Button
                                            compact
                                            size="sm"
                                            onClick={() =>
                                                handleConfirmInvoice(invoice)
                                            }
                                        >
                                            Mark Paid
                                        </Button>
                                    )}
                                </TableItem>
                            </TableRow>
                        ))}
                    </tbody>
                </StyledTable>
            </Card>

            <Card>
                <h2>How do I pay?</h2>

                <Col>
                    <StepCol>
                        <StepLabel>Step 1</StepLabel>
                        <Text>
                            Open the Splinterlands website and click the DEC
                            icon in the top right corner.
                        </Text>
                    </StepCol>
                    <StepImage src={billing1} />
                </Col>

                <Col>
                    <StepCol>
                        <StepLabel>Step 2</StepLabel>
                        <Text>Click "Select Wallet" and choose "Player".</Text>
                    </StepCol>
                    <StepImage src={billing2} />
                </Col>

                <Col>
                    <StepCol>
                        <StepLabel>Step 3</StepLabel>
                        <Text>
                            Enter the username "splintersuite" and the amount
                            owed on your invoice.
                        </Text>
                    </StepCol>
                    <StepImage src={billing3} />
                </Col>

                <StepCol>
                    <StepLabel>Step 4</StepLabel>
                    <Text>Click "Transfer Out" and sign your transaction.</Text>
                </StepCol>

                <StepCol>
                    <StepLabel>Step 5</StepLabel>
                    <Text>
                        Mark your invoice as paid in the table above. Thank you
                        for your payment!
                    </Text>
                </StepCol>
            </Card>
        </DashboardPage>
    );
};

export default Billing;
