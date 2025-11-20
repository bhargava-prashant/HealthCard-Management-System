resource "aws_eks_cluster" "health_cluster" {
  name     = "health-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = module.vpc.private_subnets
  }

  depends_on = [aws_iam_role_policy_attachment.eks_cluster_attach]
}

resource "aws_eks_node_group" "health_nodes" {
  cluster_name    = aws_eks_cluster.health_cluster.name
  node_group_name = "health-node-group"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = module.vpc.private_subnets

  scaling_config {
    desired_size = 2
    min_size     = 1
    max_size     = 3
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_node_attach,
    aws_iam_role_policy_attachment.eks_cni_attach,
    aws_iam_role_policy_attachment.eks_registry_attach
  ]
}
