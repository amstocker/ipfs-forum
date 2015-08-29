/*
 * IPFS Forum Gateway Config
 */

exports = module.exports = {
  'port'                    : 7007,
  'api_base'                : '/api/v0/',
  
  'enable_cors'             : true,
  'serve_static'            : false,
  'static_folder'           : '../webapp/public',
  'behind_reverse_proxy'    : true,

  'ipfs_host'               : 'localhost',
  'ipfs_port'               : 5001,
  'ipfs_repo_gc_interval'   : 10 /* minutes */
}
