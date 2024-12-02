const { Op } = require('sequelize');
const { Client, HistoricoCliente, sequelize } = require('../models');
const moment = require('moment');

const getDashboardData = async (req, res) => {
    const userId = req.userId;

    try {
        // Find all client IDs for the user
        const clients = await Client.findAll({
            where: { userId }
        });
        const clientIds = clients.map(client => client.id);

        if (clientIds.length === 0) {
            return res.json({ message: 'Nenhum cliente encontrado para o usuário.' });
        }

        // Consolidated financial and client metrics
        const dashboardData = await Promise.all([
            // Financial Metrics
            Client.sum('valorPegado', { where: { id: { [Op.in]: clientIds } } }),
            HistoricoCliente.sum('valor', {
                where: {
                    acao: 'Receita',
                    clienteId: { [Op.in]: clientIds },
                    data: {
                        [Op.and]: [
                            sequelize.where(sequelize.fn('MONTH', sequelize.col('data')), moment().month() + 1),
                            sequelize.where(sequelize.fn('YEAR', sequelize.col('data')), moment().year())
                        ]
                    }
                }
            }),
            HistoricoCliente.sum('valor', { 
                where: { 
                    acao: 'Quitado',
                    clienteId: { [Op.in]: clientIds }
                }
            }),
            HistoricoCliente.sum('valor', { 
                where: { 
                    acao: 'Só Juros',
                    clienteId: { [Op.in]: clientIds }
                }
            }),
            HistoricoCliente.sum('valor', { 
                where: { 
                    acao: 'Pg. Parcial',
                    clienteId: { [Op.in]: clientIds }
                }
            }),
            HistoricoCliente.sum('valor', { 
                where: { 
                    acao: 'Não Pagou',
                    clienteId: { [Op.in]: clientIds }
                }
            }),

            // Client Statistics
            Client.count({ where: { userId } }),
            Client.count({ 
                where: { 
                    userId,
                    dataEmprestimo: {
                        [Op.gte]: moment().subtract(1, 'year').toDate()
                    }
                } 
            }),
            Client.count({
                where: {
                    userId,
                    createdAt: {
                        [Op.gte]: moment().subtract(30, 'days').toDate()
                    }
                }
            }),
            Client.count({
                where: {
                    userId,
                    dataEmprestimo: {
                        [Op.lt]: moment().subtract(30, 'days').toDate()
                    }
                }
            }),
            Client.findOne({
                attributes: [
                    [sequelize.fn('AVG', sequelize.col('valorPegado')), 'averageLoanAmount']
                ],
                where: { userId },
                raw: true
            }),
            Client.sum('jurosReceber', { where: { userId } })
        ]);

        // Monthly Trends
        const monthlyTrends = await HistoricoCliente.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('data')), 'month'],
                [sequelize.fn('SUM', sequelize.col('valor')), 'totalInvested'],
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN acao = "Só Juros" THEN valor ELSE 0 END')), 'interestEarned']
            ],
            where: {
                clienteId: { [Op.in]: clientIds },
                data: {
                    [Op.gte]: moment().subtract(12, 'months').toDate()
                }
            },
            group: [sequelize.fn('MONTH', sequelize.col('data'))],
            order: [[sequelize.fn('MONTH', sequelize.col('data')), 'ASC']]
        });

        // Overdue Clients
        const overdueClientsDetailed = await Client.findAll({
            where: {
                userId,
                dataEmprestimo: {
                    [Op.lt]: moment().subtract(30, 'days').toDate()
                }
            },
            attributes: [
                'nome', 
                'cpf', 
                'dataEmprestimo', 
                'valorPegado',
                [sequelize.literal('DATEDIFF(CURRENT_DATE, dataEmprestimo)'), 'diasAtraso']
            ],
            order: [[sequelize.literal('diasAtraso'), 'DESC']],
            limit: 10
        });

        // Construct response object
        res.json({
            totalInvested: dashboardData[0],
            monthlyRevenue: dashboardData[1],
            returnedInvestments: dashboardData[2],
            interestReceived: dashboardData[3],
            partialPayments: dashboardData[4],
            lostInvestments: dashboardData[5],

            clientStats: {
                totalClients: dashboardData[6],
                activeClients: dashboardData[7],
                newClients: dashboardData[8],
                overdueClients: dashboardData[9],
                averageLoanAmount: dashboardData[10]?.averageLoanAmount || 0,
                totalInterestEarned: dashboardData[11]
            },

            monthlyTrends,

            overdueClients: overdueClientsDetailed.map(client => ({
                nome: client.nome,
                cpf: client.cpf,
                valorPegado: client.valorPegado,
                dataEmprestimo: client.dataEmprestimo,
                diasAtraso: client.getDataValue('diasAtraso')
            }))
        });
    } catch (error) {
        console.error('Erro ao calcular dados do dashboard:', error);
        res.status(500).json({ error: 'Erro ao calcular dados do dashboard' });
    }
};

module.exports = { getDashboardData };