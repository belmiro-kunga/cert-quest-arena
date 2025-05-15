# Backup e Restauração do Banco de Dados

Este diretório contém scripts para facilitar o backup e a restauração do banco de dados PostgreSQL do Cert Quest Arena.

## Requisitos

- Node.js instalado
- PostgreSQL instalado (com os utilitários `pg_dump` e `psql` disponíveis no PATH)
- Variáveis de ambiente configuradas no arquivo `.env` com as credenciais do banco de dados

## Como fazer backup do banco de dados

1. Execute o script `backup-database.bat` ou execute diretamente `node backup-database.js`
2. O script criará uma pasta `backups` (se não existir) e salvará o arquivo de backup com timestamp
3. Ao finalizar, o script mostrará uma lista de todos os backups disponíveis

## Como restaurar o banco de dados

1. Execute o script `restore-database.bat` ou execute diretamente `node restore-database.js`
2. O script mostrará uma lista de todos os backups disponíveis
3. Digite o número correspondente ao backup que deseja restaurar
4. Confirme a operação digitando 's'
5. Aguarde a conclusão da restauração

## Estrutura dos arquivos

- `backup-database.js` - Script Node.js para fazer backup do banco de dados
- `backup-database.bat` - Script batch para facilitar a execução do backup
- `restore-database.js` - Script Node.js para restaurar o banco de dados
- `restore-database.bat` - Script batch para facilitar a execução da restauração
- `backups/` - Diretório onde os backups são armazenados

## Formato dos arquivos de backup

Os backups são salvos no formato SQL padrão do PostgreSQL, com o seguinte padrão de nomenclatura:

```
certquest_backup_YYYY-MM-DD_HH-MM.sql
```

Exemplo: `certquest_backup_2025-05-15_16-45.sql`

## Observações

- Os backups incluem todas as tabelas, índices, triggers e outros objetos do banco de dados
- É recomendável fazer backups regularmente para evitar perda de dados
- Os backups podem ser transferidos para armazenamento externo para maior segurança
